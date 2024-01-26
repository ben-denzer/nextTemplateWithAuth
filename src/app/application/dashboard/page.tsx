import { LogoutButton } from '@/components/LogoutButton';
import { FakeLink } from '@/components/link/FakeLink';

const Dashboard: React.FC = () => {
  return (
    <div>
      Dashboard{' '}
      <LogoutButton>
        <FakeLink>Log out</FakeLink>
      </LogoutButton>
    </div>
  );
};

export default Dashboard;
