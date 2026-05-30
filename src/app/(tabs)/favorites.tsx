import SnippetBrowser from "../../components/SnippetBrowser";

export default function Favorites() {
  return (
    <SnippetBrowser
      favoriteOnly
      title="Favorites"
      emptyMessage="No favorite snippets match your search."
    />
  );
}
