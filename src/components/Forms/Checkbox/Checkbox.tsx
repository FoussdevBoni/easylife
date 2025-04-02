import { useState } from 'react';

interface CheckboxProps {
  labelText: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  id: string; // Ajout d'un id unique
}

const Checkbox: React.FC<CheckboxProps> = ({ id, labelText, checked = false, onChange }) => {
  const [isChecked, setIsChecked] = useState<boolean>(checked);

  const handleChange = () => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    if (onChange) onChange(newCheckedState);
  };

  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer select-none items-center">
        <div className="relative">
          <input
            type="checkbox"
            id={id} // Utilisation d'un id unique
            className="sr-only"
            checked={isChecked}
            onChange={handleChange}
          />
          <div
            className={`mr-4 flex h-5 w-5 items-center justify-center rounded border ${
              isChecked ? 'border-primary bg-gray dark:bg-transparent' : ''
            }`}
          >
            <span className={`h-2.5 w-2.5 rounded-sm ${isChecked ? 'bg-primary' : ''}`}></span>
          </div>
        </div>
        {labelText}
      </label>
    </div>
  );
};

export default Checkbox;
