import { getCurrentUser } from '@/lib/session';
import SettingsClient from './SettingsClient';

export default async function SettingsPage() {
  const user = await getCurrentUser();
  return <SettingsClient currentUser={user!} />;
}
