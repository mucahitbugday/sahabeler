interface SidebarRelationsProps {
  relatedPerson: {
    name: string;
    relationship: string;
    imageUrl: string;
  };
}

export function SidebarRelations({ relatedPerson }: SidebarRelationsProps) {
  return (
    <div className="rounded-lg border-2 border-primary/20 bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <h3 className="text-lg font-bold text-foreground">Iliskiler</h3>
        <div className="h-px flex-1 bg-border" />
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-primary/30">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${relatedPerson.imageUrl || '/placeholder.svg'})`,
            }}
          />
        </div>
        <div>
          <h4 className="font-semibold text-foreground">{relatedPerson.name}</h4>
          <p className="text-sm text-muted-foreground">{relatedPerson.relationship}</p>
        </div>
      </div>
    </div>
  );
}
