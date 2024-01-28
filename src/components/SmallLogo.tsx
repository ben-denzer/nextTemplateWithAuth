import classNames from '@/utils/frontend/classNames';

interface SmallLogoProps {
  customClasses?: string;
}

const SmallLogo: React.FC<SmallLogoProps> = (props) => {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={classNames('h-10', props.customClasses)}
      src="https://tailwindui.com/img/logos/mark.svg?color=lightBlue&shade=600"
      alt="Your Company"
    />
  );
};

export default SmallLogo;
