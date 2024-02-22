type SidebarProps = {
    isOpen: boolean;
    onClose: () => void;
  };
  

const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
   
  
   
  
    const sidebarStyle: React.CSSProperties = {
      width: isOpen ? '550px' : '0',
      height: '100%',
      position: 'fixed',
      zIndex: 100,
      top: 0,
      left: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      overflowX: 'hidden',
      transition: 'width 0.5s ease',
      padding: isOpen ? '20px' : '0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center', // Center the content horizontally
      justifyContent: 'start', // Start aligning content from top
      paddingTop: '1rem', // Add some padding at the top
    };
  
    const toggleButtonStyle: React.CSSProperties = {
      position: 'absolute',
      top: '50%',
      left: isOpen ? '530px' : '-5px',
      
      transform: 'translateY(-50%)',
      zIndex: 101,
      cursor: 'pointer',
      transition: 'left 0.5s ease',
    };
  
    const circleButtonStyle: React.CSSProperties = {
      background: 'white',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
      transition: 'transform 0.5s ease',
    };
  
    const svgStyle: React.CSSProperties = {
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.5s ease',
    };

    return (
      <>
          <div style={sidebarStyle}>
        {/* Sidebar content goes here */}

        <div className="text-[#a1fff8] p-4 space-y-4"> {/* Use TailwindCSS for spacing and text color */}
         
        </div>
        
      </div>
      <div style={toggleButtonStyle} onClick={onClose}>
        <div style={circleButtonStyle}>
          {/* SVG arrow with rotation */}
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={svgStyle}>
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      </div>
    </>
  );
};

export default Sidebar;