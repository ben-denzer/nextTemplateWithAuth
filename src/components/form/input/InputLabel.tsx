import classNames from '@/utils/frontend/classNames';

interface InputLabelProps {
  label: React.ReactNode;
  id: string;
  required?: boolean;
  customClasses?: string;
}

const InputLabel: React.FC<InputLabelProps> = (props) => {
  const { label, id, required, customClasses } = props;
  return (
    <label
      htmlFor={id}
      className={classNames(
        'block text-sm font-medium leading-6 text-normaltext',
        customClasses
      )}
    >
      {label} {required && <span className="text-dangertext">*</span>}
    </label>
  );
};

export default InputLabel;
