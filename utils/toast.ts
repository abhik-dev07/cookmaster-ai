import Toast from "react-native-toast-message";

const BASE_TOAST_OPTIONS = {
  position: "top" as const,
  topOffset: 56,
};

export const showSuccessToast = (title: string, message?: string) => {
  Toast.show({
    ...BASE_TOAST_OPTIONS,
    type: "success",
    text1: title,
    text2: message,
    visibilityTime: 2600,
    autoHide: true,
  });
};

export const showErrorToast = (title: string, message?: string) => {
  Toast.show({
    ...BASE_TOAST_OPTIONS,
    type: "error",
    text1: title,
    text2: message,
    visibilityTime: 3200,
    autoHide: true,
  });
};

export const showPendingToast = (title: string, message?: string) => {
  Toast.show({
    ...BASE_TOAST_OPTIONS,
    type: "pending",
    text1: title,
    text2: message,
    autoHide: false,
  });
};

export const hideToast = () => {
  Toast.hide();
};
