const Logo = () => (
    <svg
      width="200"
      height="100"
      viewBox="0 0 200 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* City Skyline */}
      <rect x="10" y="50" width="20" height="40" fill="#4A90E2" />
      <rect x="40" y="30" width="20" height="60" fill="#4A90E2" />
      <rect x="70" y="40" width="20" height="50" fill="#4A90E2" />
      <rect x="100" y="20" width="20" height="70" fill="#4A90E2" />
      <rect x="130" y="50" width="20" height="40" fill="#4A90E2" />
  
      {/* Green Elements (Trees) */}
      <circle cx="25" cy="50" r="10" fill="#50E3C2" />
      <circle cx="55" cy="30" r="10" fill="#50E3C2" />
      <circle cx="85" cy="40" r="10" fill="#50E3C2" />
      <circle cx="115" cy="20" r="10" fill="#50E3C2" />
      <circle cx="145" cy="50" r="10" fill="#50E3C2" />
  
      {/* Connecting Lines */}
      <line x1="20" y1="50" x2="180" y2="50" stroke="#FFA500" strokeWidth="2" />
  
      {/* Text */}
      <text x="100" y="90" textAnchor="middle" fill="#333" fontSize="12" fontFamily="Arial, sans-serif">
        City Prosperity Index
      </text>
    </svg>
  );
  
  export default Logo;