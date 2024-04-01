export class onMetaWidget {
  constructor({
    apiKey,
    chainId,
    tokenAddress,
    elementId,
    walletAddress,
    fiatAmount,
    userEmail,
    offRamp,
    onRamp,
    fiatType,
    widgetHeight,
    minAmount,
    metamask,
    environment,
    successRedirectUrl,
    failureRedirectUrl,
    isAndroid,
  }) {
    this.apiKey = apiKey || "";
    this.elementId = elementId;
    this.walletAddress = walletAddress || "";
    this.fiatAmount = fiatAmount || "";
    this.chainId = chainId || "";
    this.tokenAddress = tokenAddress || "";
    this.isEventListnerOn = false;
    this.userEmail = userEmail || "";
    this.offRamp = offRamp || "";
    this.onRamp = onRamp || "";
    this.fiatType = fiatType || "";
    this.widgetHeight = widgetHeight || "34rem";
    this.minAmount = minAmount || "";
    this.metamask = metamask || "";
    this.environment = environment || "production"; // production, staging, test, local
    this.successRedirectUrl = successRedirectUrl || "";
    this.failureRedirectUrl = failureRedirectUrl || "";
    this.isAndroid = isAndroid || "";
  }
  init() {
    let iframe = document.createElement("iframe");
    iframe.id = "onMetaWidgetId";
    iframe.allow = "clipboard-read; clipboard-write;camera";

    const iframeCustomStyles = {
      border: "none",
      // minHeight: this.widgetHeight,
      minWidth: "100%",
      overflow: "hidden",
    };
    Object.assign(iframe.style, iframeCustomStyles); // for adding the custom styles in the iframe

    if (!this.apiKey) {
      iframe.srcdoc = `<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"/> <meta http-equiv="X-UA-Compatible" content="IE=edge"/> <meta name="viewport" content="width=device-width, initial-scale=1.0"/> <title>Document</title> </head> <body> <div> <p>Invalid api key</p></div></body></html>`;
    } else {
      if (this.environment === "production") {
        iframe.src = "https://platform.onmeta.in" + this.constructUrl();
      } else if (this.environment === "staging") {
        iframe.src = "https://stg.platform.onmeta.in" + this.constructUrl();
      } else if (this.environment === "test") {
        iframe.src = "https://test.platform.onmeta.in" + this.constructUrl();
      } else if (this.environment === "local") {
        iframe.src = "http://localhost:3000" + this.constructUrl();
      }
    }
    let element = document.getElementById(this.elementId);
    element.appendChild(iframe);
  }
  close() {
    window.localStorage.clear();
    window.sessionStorage.clear();
    let iframe = document.getElementById("onMetaWidgetId");
    iframe && iframe.remove();
  }
  on(eventType, callbackFn) {
    // if (this.isEventListnerOn) return;
    window.addEventListener("message", function (event) {
      if (event.data.type === "onMetaHandler") {
        if (eventType === "ALL_EVENTS") {
          if (
            event.data.detail.cryptoSwap === "success" ||
            event.data.detail.cryptoSwap === "failed"
          ) {
            callbackFn?.(event.data.detail.cryptoSwap);
          }
        }
        if (
          event.data.detail.cryptoSwap === "failed" &&
          eventType === "FAILED"
        ) {
          callbackFn?.(event.data.detail.cryptoSwap);
        }
        if (
          event.data.detail.cryptoSwap === "success" &&
          eventType === "SUCCESS"
        ) {
          callbackFn?.(event.data.detail.cryptoSwap);
        }

        if (eventType === "ORDER_EVENTS") {
          if (event.data.detail.eventCategory === "order") {
            callbackFn?.(event.data.detail);
          }
        }

        if (eventType === "ORDER_COMPLETED_EVENTS") {
          if (
            event.data.detail.eventCategory === "order" &&
            event.data.detail.paymentType === "buy" &&
            (event.data.detail.cryptoSwap === "success" ||
              event.data.detail.cryptoSwap === "failed")
          ) {
            callbackFn?.(event.data.detail);
          } else if (
            event.data.detail.eventCategory === "order" &&
            event.data.detail.paymentType === "sell" &&
            (event.data.detail.paymentStatus === "success" ||
              event.data.detail.paymentStatus === "failed")
          ) {
            callbackFn?.(event.data.detail);
          }
        }

        if (eventType === "ACTION_EVENTS") {
          if (event.data.detail.eventCategory === "action") {
            callbackFn?.(event.data.detail);
          }
        }
      }
    });
    // this.isEventListnerOn = true;
  }

  constructUrl() {
    let widgetUrl = "/?";

    this.apiKey && (widgetUrl += `apiKey=${this.apiKey}`);
    this.walletAddress && (widgetUrl += `&walletAddress=${this.walletAddress}`);
    this.fiatAmount && (widgetUrl += `&fiatAmount=${this.fiatAmount}`);
    this.userEmail && (widgetUrl += `&userEmail=${this.userEmail}`);
    this.tokenAddress && (widgetUrl += `&tokenAddress=${this.tokenAddress}`);
    this.chainId && (widgetUrl += `&chainId=${this.chainId}`);
    this.offRamp && (widgetUrl += `&offRamp=${this.offRamp}`);
    this.onRamp && (widgetUrl += `&onRamp=${this.onRamp}`);
    this.minAmount && (widgetUrl += `&minAmount=${this.minAmount}`);
    this.metamask && (widgetUrl += `&metamask=${this.metamask}`);
    this.fiatType && (widgetUrl += `&fiatType=${this.fiatType}`);
    this.successRedirectUrl &&
      (widgetUrl += `&successRedirectUrl=${this.successRedirectUrl}`);
    this.failureRedirectUrl &&
      (widgetUrl += `&failureRedirectUrl=${this.failureRedirectUrl}`);
    this.isAndroid && (widgetUrl += `&isAndroid=${this.isAndroid}`);

    return widgetUrl;
  }
}

window.onMetaWidget = onMetaWidget;
