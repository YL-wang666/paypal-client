import ReactGA from 'react-ga';

export function initializeAnalytics() {
  ReactGA.initialize('G-60WXL3CS9M'); // 用您的跟踪 ID 替换 G-XXXXXXXXXX
}

export function trackPageView(page) {
  ReactGA.pageview(page);
}
