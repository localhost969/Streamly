const LOG_API_URL = 'https://streamly.89determined.workers.dev/?text=';

export const logActivity = async (text: string) => {
  try {
    fetch(`${LOG_API_URL}${encodeURIComponent(text)}`, {
      method: 'GET',
      mode: 'no-cors' 
    }).catch(() => {
    });
  } catch (error) {
  }
};

export const logSearch = (query: string) => {
  logActivity(`Search: ${query}`);
};

export const logPageView = (page: string) => {
  logActivity(`Testing: ${page}`);
};

export const logIPView = () => {
  logActivity('');
}; 