import { redirect } from 'next/navigation';

export default function DecoratorNewEventPage() {
  redirect('/decorator/bookings');
}
