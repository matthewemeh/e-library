import { encrypt, decrypt } from 'n-krypta';

export const toggleClass = (element?: HTMLElement | null, ...classes: string[]) => {
  if (element) classes.forEach(className => element.classList.toggle(className));
};

export const addClass = (element?: HTMLElement | null, ...classes: string[]) => {
  if (element) classes.forEach(className => element.classList.add(className));
};

export const removeClass = (element?: HTMLElement | null, ...classes: string[]) => {
  if (element) classes.forEach(className => element.classList.remove(className));
};

export const showAlert = ({
  msg,
  zIndex = '0',
  duration = 3000,
  textColor = '#fff',
  bgColor = '#263a53'
}: AlertProps) => {
  const alertDiv: HTMLDivElement = document.createElement('div');
  alertDiv.id = 'alert';
  addClass(
    alertDiv,
    'p-4',
    'fixed',
    'w-max',
    'mb-8',
    'left-1/2',
    'rounded-md',
    'text-[1rem]',
    'ease-in-out',
    'text-center',
    'max-w-[80vw]',
    'duration-500',
    'transition-all',
    '-translate-x-1/2',
    'tracking-[0.04em]'
  );
  alertDiv.style.bottom = '-150px';
  document.body.appendChild(alertDiv);

  setTimeout(() => {
    alertDiv.style.background = bgColor;
    alertDiv.style.color = textColor;
    alertDiv.innerHTML = msg;
    alertDiv.style.bottom = '0px';

    if (zIndex !== '0') alertDiv.style.zIndex = zIndex;

    setTimeout(() => {
      alertDiv.style.bottom = '-150px';
      setTimeout(() => document.body.removeChild(alertDiv), 1000);
    }, duration);
  }, 200);
};

export const formatInputText = ({
  text,
  regex,
  allowedChars,
  disallowedChars
}: FormatInputTextProps): string => {
  let newValue: string = text;
  const characters: string[] = text.split('');

  if (allowedChars) {
    newValue = characters.map(char => (allowedChars.includes(char) ? char : '')).join('');
  } else if (disallowedChars) {
    newValue = characters.map(char => (disallowedChars.includes(char) ? '' : char)).join('');
  } else if (regex) {
    // this tests each individual character and not the string as a whole
    newValue = characters.map(char => (regex.test(char) ? char : '')).join('');
  }

  return newValue;
};

export const swapElements = (array: any[], index1: number, index2: number) => {
  try {
    [array[index1], array[index2]] = [array[index2], array[index1]];
  } catch (error) {
    console.error(error);
  }
};

export const rearrangeElements = (array: any[], sourceIndex: number, destinationIndex: number) => {
  const blockDifference: number = sourceIndex - destinationIndex;
  const isBlockMovingUp: boolean = blockDifference > 0;
  const isBlockMovingDown: boolean = blockDifference < 0;

  if (isBlockMovingDown) {
    for (let i = sourceIndex; i < destinationIndex; i++) {
      swapElements(array, i, i + 1);
    }
  } else if (isBlockMovingUp) {
    for (let i = sourceIndex; i > destinationIndex; i--) {
      swapElements(array, i, i - 1);
    }
  }
};

export const getRndInteger = (min: number, max: number): number => {
  // returns a random integer from min to (max - 1)
  return Math.floor(Math.random() * (max - min)) + min;
};

export const getOtp = (digits: number): string => {
  let otp = '';
  for (let i = 0; i < digits; i++) otp += getRndInteger(0, 10).toString();
  return otp;
};

export const generateOTP = (n: number): OtpDetails => {
  const otp: string = getOtp(n);
  const secret: string = process.env.REACT_APP_OTP_SECRET_KEY!;
  const ENCRYPTION_CYCLE: number = Number(process.env.REACT_APP_OTP_ENCRYPTION_CYCLE!);

  const encryptedOtp = encrypt(otp, secret, ENCRYPTION_CYCLE);
  return { otp, encryptedOtp };
};

export const decryptString = (encryptedString: string): string => {
  const secret: string = process.env.REACT_APP_OTP_SECRET_KEY!;
  const ENCRYPTION_CYCLE: number = Number(process.env.REACT_APP_OTP_ENCRYPTION_CYCLE!);

  let decryptedString = encryptedString;
  for (let i = 0; i < ENCRYPTION_CYCLE; i++) {
    decryptedString = decrypt(decryptedString, secret);
  }
  return decryptedString;
};

export const validateOTP = (enteredOtp: string, encryptedOtp: string): boolean => {
  let decryptedString = decryptString(encryptedOtp);

  return enteredOtp === decryptedString;
};

export const secondsToMMSS = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secondsLeft = seconds % 60;

  return `${minutes.toString().padStart(2, '0')}:${secondsLeft.toString().padStart(2, '0')}`;
};
