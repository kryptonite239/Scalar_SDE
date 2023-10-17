export default function BookingCard({ details }) {
  return (
    <div>
      <ul>
        <li>{details.room_no}</li>
        <li>{details.pice}</li>
        <li>{details.starttime}</li>
        <li>{details.endtime}</li>
      </ul>
    </div>
  );
}
