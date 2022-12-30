export default class Http {
  /**
   * Get the relevant status message for a status code.
   *
   * @param statusCode The status code
   * @returns The status message
   */
  public static getStatusMessage(statusCode: number): string {
    switch (statusCode) {
      // Informational status codes
      case 100:
        return "Continue"
      case 101:
        return "Switch protocols"
      case 102:
        return "Processing"

      // Success status codes
      case 200:
        return "Ok"
      case 201:
        return "Created"
      case 202:
        return "Accepted"
      case 203:
        return "Non-authoritive information"
      case 204:
        return "No content"
      case 205:
        return "Reset content"
      case 206:
        return "Partial content"
      case 207:
        return "Multi-status"
      case 208:
        return "Already reported"
      case 226:
        return "Im used"

      // Redirectional status codes
      case 300:
        return "Multiple choices"
      case 301:
        return "Moved permanently"
      case 302:
        return "Found"
      case 303:
        return "See other"
      case 304:
        return "Not modified"
      case 305:
        return "Use proxy"
      case 307:
        return "Temporary redirect"
      case 308:
        return "Permanent redirect"

      // Client error status codes
      case 400:
        return "Bad request"
      case 401:
        return "Unauthorized"
      case 402:
        return "Payment required"
      case 403:
        return "Forbidden"
      case 404:
        return "Not found"
      case 405:
        return "Method not allowed"
      case 406:
        return "Not acceptable"
      case 407:
        return "Proxy authentication required"
      case 408:
        return "Request timeout"
      case 409:
        return "Conflict"
      case 410:
        return "Gone"
      case 411:
        return "Length required"
      case 412:
        return "Precondition failed"
      case 413:
        return "Payload too large"
      case 414:
        return "Request-URI too long"
      case 415:
        return "Unsupported media type"
      case 416:
        return "Request range not satisfiable"
      case 417:
        return "Expectation failed"
      case 418:
        return "Im a teapot"
      case 421:
        return "Misdirected request"
      case 422:
        return "Unprocessable entity"
      case 423:
        return "Locked"
      case 424:
        return "Failed dependency"
      case 426:
        return "Upgrade required"
      case 428:
        return "Precondition required"
      case 429:
        return "Too many requests"
      case 431:
        return "Request header fields too large"
      case 444:
        return "Connection closed without response"
      case 451:
        return "Unavailable for legal reasons"
      case 499:
        return "Client closed request"

      // Server error status codes
      case 500:
        return "Internal server error"
      case 501:
        return "Not implemented"
      case 502:
        return "Bad gateway"
      case 503:
        return "Service unavailable"
      case 504:
        return "Gateway timeout"
      case 505:
        return "HTTP version not supported"
      case 506:
        return "Variant also negotiates"
      case 507:
        return "Insufficient storage"
      case 508:
        return "Loop detected"
      case 510:
        return "Not extended"
      case 511:
        return "Network authentication required"
      case 599:
        return "Network connection timeout error"

      // Default response
      default:
        return "Unknown"
    }
  }
}
