interface CityPageProps {
  params: Promise<{ city: string }>;
}

export default async function CityPage({ params }: CityPageProps) {
  const { city } = await params;

  return (
    <main>
      {/* Dashboard de ciudad — SSR */}
      <h1>{city}</h1>
    </main>
  );
}
