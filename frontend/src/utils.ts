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
    'text-white',
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
