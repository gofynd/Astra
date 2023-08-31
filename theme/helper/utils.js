import { isBrowser } from "browser-or-node";
export const debounce = (func, wait, immediate) => {
  var timeout;

  // This is the function that is actually executed when
  // the DOM event is triggered.
  return function executedFunction() {
    // Store the context of this and any
    // parameters passed to executedFunction
    var context = this;
    var args = arguments;

    // The function to be called after
    // the debounce time has elapsed
    var later = function () {
      // null timeout to indicate the debounce ended
      timeout = null;

      // Call function now if you did not on the leading end
      if (!immediate) func.apply(context, args);
    };

    // Determine if you should call the function
    // on the leading or trail end
    var callNow = immediate && !timeout;

    // This will reset the waiting every function execution.
    // This is the step that prevents the function from
    // being executed because it will never reach the
    // inside of the previous setTimeout
    clearTimeout(timeout);

    // Restart the debounce waiting period.
    // setTimeout returns a truthy value (it differs in web vs node)
    timeout = setTimeout(later, wait);

    // Call immediately if you're dong a leading
    // end execution
    if (callNow) func.apply(context, args);
  };
};
export const detectMobile = () => {
  if (
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/webOS/i) ||
    navigator.userAgent.match(/iPhone/i) ||
    navigator.userAgent.match(/iPad/i) ||
    navigator.userAgent.match(/iPod/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/Windows Phone/i)
  ) {
    return true;
  } else {
    return false;
  }
};

export const detectMobileWidth = () => {
  if (isBrowser) {
    if (window && window.screen?.width <= 768) {
      return true;
    } else {
      return false;
    }
  }
};

export const copyToClipboard = (str) => {
  const el = document.createElement("textarea"); // Create a <textarea> element
  el.value = str; // Set its value to the string that you want copied
  el.setAttribute("readonly", ""); // Make it readonly to be tamper-proof
  el.style.position = "absolute";
  el.style.left = "-9999px"; // Move outside the screen to make it invisible
  document.body.appendChild(el); // Append the <textarea> element to the HTML document
  const selected =
    document.getSelection().rangeCount > 0 // Check if there is any content selected previously
      ? document.getSelection().getRangeAt(0) // Store selection if found
      : false; // Mark as false to know no selection existed before
  el.select(); // Select the <textarea> content
  document.execCommand("copy"); // Copy - only works as a result of a user action (e.g. click events)
  document.body.removeChild(el); // Remove the <textarea> element
  if (selected) {
    // If a selection existed before copying
    document.getSelection().removeAllRanges(); // Unselect everything on the HTML document
    document.getSelection().addRange(selected); // Restore the original selection
  }
};

export const checkHtml = (string) => {
  return /<(?=.*? .*?\/ ?>|br|hr|input|!--|wbr)[a-z]+.*?>|<([a-z]+).*?<\/\1>/i.test(
    string
  );
};

export const differenceInDays = (start, end) => {
  let difference = Math.ceil(
    (new Date(end).getTime() - new Date(start).getTime()) / (1000 * 3600 * 24)
  );
  let resultString = "";
  if (difference <= 30) {
    resultString = difference > 1 ? `${difference} days` : `${difference} day`;
  } else if (difference > 30 && difference < 365) {
    resultString =
      Math.ceil(difference / 30) > 1
        ? `${Math.ceil(difference / 30)} months`
        : `${Math.ceil(difference / 30)} month`;
  } else {
    resultString =
      Math.ceil(difference / 365) > 1
        ? `${Math.ceil(difference / 365)} years`
        : `${Math.ceil(difference / 365)} year`;
  }
  return resultString;
};

export const isValidEmail = (value) => {
  value = value.trim();
  if (value.length === 0) {
    return false;
  } else {
    let re =
      //eslint-disable-next-line
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let testEmail = re.test(String(value).toLowerCase());
    if (!testEmail) {
      return false;
    }
  }
  return true;
};

export const getPriceText = (product, key, options, listing_price_config) => {
  let price;
  const priceDetails = product.price?.[key];

  if (product && product.price) {
    switch (listing_price_config) {
      case "min":
        price =
          currencyFormat(priceDetails?.min, priceDetails.currency_symbol) || "";
        break;

      case "max":
        price =
          currencyFormat(priceDetails?.max, priceDetails.currency_symbol) || "";
        break;

      default:
        price =
          priceDetails?.min !== priceDetails?.max
            ? (currencyFormat(
                priceDetails?.min,
                priceDetails.currency_symbol
              ) || "") +
              " - " +
              (currencyFormat(
                priceDetails?.max,
                priceDetails.currency_symbol
              ) || "")
            : currencyFormat(priceDetails?.min, priceDetails.currency_symbol) ||
              "";
        //not handling this as its the default behaviour of getProductPrice
        break;
    }
  }

  return price;
};

export const getPrice = (product, key) => {
  if (product && product.price) {
    const priceDetails = product.price?.[key];

    return priceDetails?.min !== priceDetails?.max
      ? (currencyFormat(priceDetails?.min, priceDetails?.currency_symbol) ||
          "") +
          " - " +
          (currencyFormat(priceDetails?.max, priceDetails?.currency_symbol) ||
            "")
      : currencyFormat(priceDetails?.min, priceDetails?.currency_symbol) || "";
  }
};

export const hasDiscount = (product) => {
  return getPrice(product, "effective") !== getPrice(product, "marked");
};

export const glidePaginate = (total, perpage) => {
  perpage = 1;
  var pages = [];
  for (let i = 0; i < total; i = i + perpage) {
    pages.push(String(i));
  }

  return pages;
};

export const logoUrl = function (logo, mobileLogo) {
  let url = logo.secure_url;
  if (detectMobileWidth()) {
    url = mobileLogo ? mobileLogo.secure_url : url;
  }
  return url;
};

export function throttle(func, wait) {
  let waiting = false;
  return function () {
    if (waiting) {
      return;
    }

    waiting = true;
    setTimeout(() => {
      func.apply(this, arguments);
      waiting = false;
    }, wait);
  };
}

export const getGlobalConfigValue = function (global_config, id) {
  return global_config?.props?.[id] || "";
};

export const getSectionPropValue = function (settings, id) {
  return settings?.props?.[id]?.value || "";
};

export const getPageConfigValue = function (page_config, id) {
  return page_config?.props?.[id] || "";
};

export const getReviewRatingData = function (customMeta) {
  let data = {};

  if (customMeta && customMeta.length) {
    customMeta.forEach((item) => {
      if (item["key"]) {
        data[item["key"]] = Number(item?.value || "");
      }
    });

    const avgRating = data["rating_sum"] / data["rating_count"];

    data["avg_ratings"] = Number(Number(avgRating).toFixed(1)) || 0;
  }

  return data;
};

export const getProductImgAspectRatio = function (
  global_config,
  defaultAspectRatio = 0.8
) {
  const productImgWidth = global_config?.props?.product_img_width;
  const productImgHeight = global_config?.props?.product_img_height;

  if (productImgWidth && productImgHeight) {
    const aspectRatio = Number(productImgWidth / productImgHeight).toFixed(2);
    return aspectRatio >= 0.6 && aspectRatio <= 1
      ? aspectRatio
      : defaultAspectRatio;
  }

  return defaultAspectRatio;
};

export const transformImage = (url, key, width) => {
  const dpr = Math.min(
    Math.max(Math.round(isBrowser ? window.devicePixelRatio || 1 : 1), 1),
    5
  );
  let updatedUrl = url;
  if (key && width) {
    let str = "/" + key + "/";
    updatedUrl = url.replace(new RegExp(str), "/resize-w:" + width + "/");
  }
  try {
    let parsedUrl = new URL(updatedUrl);
    parsedUrl.searchParams.append("dpr", 1);
    return parsedUrl.toString();
  } catch (error) {
    return updatedUrl;
  }
};

export const currencyFormat = (value, currencySymbol) => {
  if (value || value === 0) {
    return `${currencySymbol}${value?.toLocaleString("en-IN")}`;
  }
};
