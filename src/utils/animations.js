// Animation utilities and helpers

export const fadeIn = {
  animation: 'fadeIn 0.3s ease',
};

export const slideUp = {
  animation: 'slideUp 0.3s ease',
};

export const slideDown = {
  animation: 'slideDown 0.3s ease',
};

export const scaleIn = {
  animation: 'scaleIn 0.3s ease',
};

export const bounce = {
  animation: 'bounce 1s infinite',
};

export const pulse = {
  animation: 'pulse 2s infinite',
};

export const shake = {
  animation: 'shake 0.5s ease',
};

// CSS keyframes to be injected
export const animationStyles = `
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slideDown {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-10px);
  }
  75% {
    transform: translateX(10px);
  }
}

@keyframes progressPulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
`;

// Inject animation styles into document
if (typeof document !== 'undefined') {
  const styleId = 'slam-book-animations';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = animationStyles;
    document.head.appendChild(style);
  }
}


