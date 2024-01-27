import classNames from '@/utils/frontend/classNames';
import InputLabel from './InputLabel';
import RhfTextInput, { RhfTextInputProps } from './RhfTextInput';

interface RhfTextInputWithLabelProps extends RhfTextInputProps {
  label: React.ReactNode;
  wrapperClasses?: string;
  labelClasses?: string;
  inputWrapperClasses?: string;
  inputClasses?: string;
}

const RhfTextInputWithLabel: React.FC<RhfTextInputWithLabelProps> = (props) => {
  const {
    register,
    autoComplete,
    type,
    error,
    label,
    id,
    required,
    wrapperClasses,
    labelClasses,
    inputWrapperClasses,
    inputClasses,
    ...rest
  } = props;

  return (
    <div className={wrapperClasses}>
      {typeof label === 'string' && (
        <InputLabel
          label={label}
          id={id}
          required={required}
          customClasses={labelClasses}
        />
      )}
      {typeof label !== 'string' && label}
      <div className={classNames('mt-2', inputWrapperClasses)}>
        <RhfTextInput
          register={register}
          id={id}
          type={type}
          error={error}
          required={true}
          autoComplete={autoComplete}
          customClasses={inputClasses}
          {...rest}
        />
      </div>
    </div>
  );
};

export default RhfTextInputWithLabel;
