import React from 'react';

const TextField = ({ placeholder, value, onChange, type = 'text', label }) => {
  return (
    <div className="w-full fadeInUp">
      {label && <label className="block text-sm font-medium text-black mb-2">{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-6 py-4 roundedSoft border-0 outline-none transition-all"
        style={{
          backgroundColor: '#f7f7f7',
          color: '#000000',
          fontSize: '16px',
          boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.10), 0px 8px 30px rgba(0, 0, 0, 0.06)',
        }}
        onFocus={(e) => {
          e.target.style.boxShadow = '0px 6px 20px rgba(74, 108, 247, 0.14), 0px 10px 35px rgba(74, 108, 247, 0.10)';
          e.target.style.transform = 'translateY(-2px)';
        }}
        onBlur={(e) => {
          e.target.style.boxShadow = '0px 4px 15px rgba(0, 0, 0, 0.10), 0px 8px 30px rgba(0, 0, 0, 0.06)';
          e.target.style.transform = 'translateY(0px)';
        }}
      />
    </div>
  );
};

export default TextField;
