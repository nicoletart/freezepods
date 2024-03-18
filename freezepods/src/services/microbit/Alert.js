import React, { useRef, useEffect } from 'react';

const Alert = ({ text }) => {
  const toastRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    const toastInstance = window.bootstrap.Toast.getOrCreateInstance(toastRef.current, {
      delay: 1500,
    });
    toastInstance.show();
    bodyRef.current.textContent = text;
  }, [text]);

  return (
    <div id="liveToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true" ref={toastRef}>
      <div id="toastBody" className="toast-body" ref={bodyRef}></div>
    </div>
  );
};

export default Alert;
