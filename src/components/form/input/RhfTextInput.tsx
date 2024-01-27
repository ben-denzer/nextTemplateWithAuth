import classNames from '@/utils/frontend/classNames';
import { UseFormRegister } from 'react-hook-form';

export interface RhfTextInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  register: UseFormRegister<any>;
  id: string;
  type: 'text' | 'email' | 'password' | 'tel';
  error: boolean;
  parseAsNumber?: boolean;
  customClasses?: string;
}

const RhfTextInput: React.FC<RhfTextInputProps> = (props) => {
  const { register, id, type, error, required, customClasses, ...rest } = props;

  const commonStyles =
    'block w-full rounded-md border-0 py-1.5 text-normaltext shadow-sm ring-1 ring-inset  placeholder:text-extralighttext focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6';

  let styles = commonStyles;
  if (error) {
    styles = `${commonStyles} ring-red-500 focus:ring-red-600`;
  } else if (props.disabled) {
    styles = `${commonStyles} bg-extralighttext ring-extralighttext focus:ring-extralighttext`;
  } else {
    styles = `${commonStyles} ring-gray-300 focus:ring-primary-600`;
  }

  return (
    <input
      aria-invalid={error ? 'true' : 'false'}
      id={id}
      type={type}
      autoComplete={props.autoComplete || 'off'}
      className={classNames(styles, customClasses)}
      required={required}
      {...rest}
      {...register(id, { required, valueAsNumber: props.parseAsNumber })}
    />
  );
};

export default RhfTextInput;
