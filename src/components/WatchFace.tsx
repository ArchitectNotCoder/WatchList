interface WatchFaceProps {
  size?: number;
  hourDeg?: number;
  minuteDeg?: number;
  borderColor?: string;
}

export default function WatchFace({
  size = 90,
  hourDeg = 120,
  minuteDeg = 200,
  borderColor = "#C9A84C",
}: WatchFaceProps) {
  const handH = size * 0.36;
  const handM = size * 0.44;
  const dotSize = size * 0.065;

  return (
    <div
      className="wface"
      style={{
        width: size,
        height: size,
        border: `1.5px solid ${borderColor}`,
      }}
    >
      <div
        className="hand hh"
        style={{
          ["--h" as any]: `${hourDeg}deg`,
          width: "1.5px",
          height: handH,
          background: borderColor,
        }}
      />
      <div
        className="hand hm"
        style={{
          ["--m" as any]: `${minuteDeg}deg`,
          width: "1px",
          height: handM,
          background: "#F0EBE1",
        }}
      />
      <div
        className="hd"
        style={{
          width: dotSize,
          height: dotSize,
          background: borderColor,
        }}
      />
    </div>
  );
}
