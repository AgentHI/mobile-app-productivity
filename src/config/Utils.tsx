import { PermissionsAndroid, Platform } from "react-native";
import DeviceInfo from "react-native-device-info";
import { Toast } from "react-native-toast-notifications";

// Function to check if a string is a valid email address
export const isValidEmail = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};


export const TOAST = (
  message: string,
  duration: number = 4000,
  type?: string,
  placement: "center" | "bottom" | "top"  = 'bottom'
  
) => {
  return Toast?.show(message, {
    placement: placement,
    animationType: 'slide-in',
    type: type,
    duration: duration,
  });
};

export const TOAST_ = (
  message: string,
  type: 'normal' | 'success' | 'warning' | 'danger' | 'custom' = 'normal',
  duration: number = 2000,
  placement: 'bottom' | 'top' | 'center' | undefined = 'bottom',
  animationType: 'slide-in' | 'zoom-in' = 'slide-in',
) => {
  return Toast?.show(message, {
    placement: placement,
    animationType: animationType,
    type: type,
    duration: duration,
  });
};


export const formatDate = (dateString:any) => {
  const date = new Date(dateString);
  const year = date?.getFullYear();
  const month = date?.toLocaleString('default', { month: 'short' });
  const day = String(date?.getDate())?.padStart(2, '0');
  return `${day} ${month} ${year} `;
};


export const TrimmedText=(text:string, maxLength:number)=> {
  if (typeof text !== 'string' || typeof maxLength !== 'number') {
    console.warn('Invalid input: text should be a string and maxLength should be a number');
    return '';
  }

  return text?.length > maxLength ? text?.slice(0, maxLength) + '..' : text;
}


export const FormatDateToReadable=(dateString:string)=> {
  const date = new Date(dateString);

  const options = {
    weekday: 'long', // e.g., "Sunday"
    month: 'long', // e.g., "November"
    day: 'numeric', // e.g., "17"
  };

  return date.toLocaleString('en-US', options); 
}

export const FormatDateToReadableShort=(dateString:string)=> {
  const date = new Date(dateString);

  const options = {
    month: 'short',
    day: 'numeric',
  };

  return date.toLocaleString('en-US', options); 
}

export const GetParsedTime = (dateString:string)=> {
  const date = new Date(dateString);

  const options = {
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true, 
  };

  return date.toLocaleTimeString('en-US', options);
}


export const SplitFullName= (fullName:string)=> {
  const nameParts = fullName.trim().split(/\s+/);
  const firstName = nameParts[0] || '';
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
  
  return {
      firstName: firstName,
      lastName: lastName
  };
}

export const GetDeviceInfo = async() => {
  const info = {
    uniqueId: await DeviceInfo.getUniqueId(),
    deviceId:  DeviceInfo.getDeviceId(),
    systemName:  DeviceInfo.getSystemName(),
    systemVersion:  DeviceInfo.getSystemVersion(),
    brand:  DeviceInfo.getBrand(),
    model:  DeviceInfo.getModel(),
    deviceName: await DeviceInfo.getDeviceName(),
    isEmulator: await DeviceInfo.isEmulator(),
    isTablet:  DeviceInfo.isTablet(),
    appVersion:  DeviceInfo.getVersion(),
    appBuildNumber:  DeviceInfo.getBuildNumber(),
    userAgent: await DeviceInfo.getUserAgent(),
    ipAddress: await DeviceInfo.getIpAddress(),
    isBatteryCharging: await DeviceInfo.isBatteryCharging(),
    batteryLevel: await DeviceInfo.getBatteryLevel(),
    fontScale: await DeviceInfo.getFontScale(),
    carrier: await DeviceInfo.getCarrier(),
  }

  return info
}

export const GetBuildNumber = () => {
  let buildNumber = DeviceInfo.getVersion() + '.' + DeviceInfo.getBuildNumber();
  return buildNumber;
};



export const RequestStoragePermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message: 'This app needs access to your storage to upload profile pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Storage permission granted');
        return true;
      } else {
        console.log('Storage permission denied');
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  } else {
    return true;
  }
};
