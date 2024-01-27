import classNames from '@/utils/classNames';
import LoadingSpinner from './LoadingSpinner';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  customClasses?: string;
  buttonStyle: 'submit' | 'info' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  disabledCallback: () => void | Promise<void>;
  onClick?: () => void | Promise<void>;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = (props) => {
  const {
    customClasses,
    buttonStyle,
    disabled,
    disabledCallback,
    onClick,
    loading,
    type,
    children,
    ...rest
  } = props;

  const commonStyles =
    'flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 min-h-[36px]';

  let styles = commonStyles;
  if (disabled || loading) {
    styles = `${commonStyles} bg-lighttext text-lighttext cursor-not-allowed`;
  } else if (buttonStyle === 'submit') {
    styles = `${commonStyles} bg-button-submit text-button-submit-textcolor hover:bg-button-submit-hover focus-visible:outline-button-submit`;
  } else if (buttonStyle === 'info') {
    styles = `${commonStyles}  bg-button-info text-button-info-textcolor hover:bg-button-info-hover focus-visible:outline-button-info`;
  } else if (buttonStyle === 'danger') {
    styles = `${commonStyles}  bg-button-danger text-button-danger-textcolor hover:bg-button-danger-hover focus-visible:outline-button-danger`;
  }

  // when a button is disabled, we can't pop up a toast message or anything.
  // so even when it is "disabled", we don't want to tell the DOM that... unless there is no disabledCallback provided
  const actuallyDisableButton = (disabled && !disabledCallback) || loading;

  const handleClick = (e: React.MouseEvent) => {
    if (loading) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (disabled) {
      e.preventDefault();
      e.stopPropagation();
      if (disabledCallback) {
        disabledCallback();
      }
      return;
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      type={type || 'button'}
      className={classNames(styles, customClasses)}
      disabled={actuallyDisableButton}
      onClick={handleClick}
      {...rest}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <LoadingSpinner size={20} color="light" />
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
