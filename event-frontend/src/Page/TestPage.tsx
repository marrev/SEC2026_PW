import AddEvent from "../Component/AddEvent.tsx";
import type {User} from "../utils/types.ts"

type Props = {
    user: User|null;
    isAuthenticated :boolean|null;
}
export default function HomePage({user, isAuthenticated}:Props){
    //const [events, setEvents] = useState<EventModel[]>([]);

    return (
        <div className="stack">
            <h1>Page de test</h1>
            <h2>Test actuel:</h2>
            {isAuthenticated ?(
                <div>
                    <p>Ajout d'événement</p>
                    <AddEvent user={user} ></AddEvent>
                </div>
            ):(
                <p>Non connecté</p>
            )}
        </div>
    );
}