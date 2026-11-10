import { CountrySearch } from "./CountrySearch";
import NewPostForm from "./NewPostForm";
import UserList from "./UserList";

export default function App() {
  return (
    <>
      {/* <h1>Welcome to the App</h1> */}
      <UserList />
      <CountrySearch />
      <NewPostForm />
    </>
  )
}