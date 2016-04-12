#import "RCTWebViewProxyManager.h"
#import "RCTEventDispatcher.h"
#import "RCTLog.h"
#import "WebViewProxy.h"

@implementation RCTWebViewProxyManager

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

NSMutableDictionary *responses;

RCT_EXPORT_METHOD(handleRequestsMatching:(NSString *)pattern)
{
  responses = [[NSMutableDictionary alloc] init];
  [WebViewProxy handleRequestsMatching:[NSPredicate predicateWithFormat:@"absoluteString like %@", pattern] handler:^(NSURLRequest* req, WVPResponse *res) {

    NSString *url = req.URL.absoluteString;
    NSMutableURLRequest *proxyReq = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:url]];
    [proxyReq setHTTPMethod: req.HTTPMethod];
    [proxyReq setHTTPBody: req.HTTPBody];

    NSURLSession *session = [NSURLSession sharedSession];
    NSURLSessionDataTask *task = [session dataTaskWithRequest:proxyReq
                                            completionHandler:
                                            ^(NSData *proxyData, NSURLResponse *proxyRes, NSError *proxyErr) {
      if (proxyErr) {
        [res pipeError:proxyErr];
      } else {
        NSInteger statusCode = [(NSHTTPURLResponse*)proxyRes statusCode];
        NSDictionary *headers = [(NSHTTPURLResponse*)proxyRes allHeaderFields];
        NSString *id = [[NSUUID UUID] UUIDString];
        [responses setObject:res forKey:id];
        NSString* data = [[NSString alloc] initWithData:proxyData encoding:[NSString defaultCStringEncoding]];
        [self.bridge.eventDispatcher sendAppEventWithName:@"WebRequest"
                                                     body:@{@"id": id,
                                                            @"url": req.URL.absoluteString,
                                                            @"method": req.HTTPMethod,
                                                            @"status": [NSNumber numberWithInteger:statusCode],
                                                            @"headers": headers,
                                                            @"data": data}];
        }
    }];
    [task resume];
  }];
}

RCT_EXPORT_METHOD(sendResponse:(NSString *)id status:(nonnull NSNumber *)status headers:(NSDictionary *)headers data:(NSString *)dataString)
{
  WVPResponse *res = [responses objectForKey:id];
  NSData* data = [dataString dataUsingEncoding:[NSString defaultCStringEncoding]];
  [res setHeaders:headers];
  [res respondWithData:data mimeType:[headers objectForKey:@"Content-Type"] statusCode:status.longValue];
  [responses removeObjectForKey:id];
}

RCT_EXPORT_METHOD(removeAllHandlers)
{
  [WebViewProxy removeAllHandlers];
}

@end
