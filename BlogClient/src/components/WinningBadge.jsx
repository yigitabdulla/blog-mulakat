import CrownBadge from './CrownBadge';

const WinningBadge = ({ size = 'large', type = 'crown' }) => {
  return (
    <div className="absolute -top-2 -right-2 z-20">
      <CrownBadge size={size} type={type} />
    </div>
  );
};

export default WinningBadge;
