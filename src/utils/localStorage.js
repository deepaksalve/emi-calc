
export const getItem = item => {
  try {
    const value = localStorage.getItem(item) || '';

    return value;
  } catch (e) {
    // Log e
    return '';
  }
};

export const setItem = (item, value) => {
  try {
    localStorage.setItem(item, value);

    return true;
  } catch (e) {
    // Log e
    return false;
  }
};

export const removeItem = item => {
  try {
    localStorage.removeItem(item);

    return true;
  } catch (e) {
    // Log e
    return false;
  }
};
