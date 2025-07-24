import { Toaster } from '@/components/ui/sonner';
import PasswordGenerator from '@/components/PasswordGenerator';

function App() {
    return (
        <>
            <PasswordGenerator />
            <Toaster position="top-center" />
        </>
    );
}

export default App;