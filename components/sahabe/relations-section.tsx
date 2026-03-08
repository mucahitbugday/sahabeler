import type { Relation } from '@/types';

interface RelationsSectionProps {
  relations: Relation[];
  mainPersonName: string;
}

export function RelationsSection({ relations, mainPersonName }: RelationsSectionProps) {
  const spouse = relations.find(r => r.relationship === 'Eşi');
  const children = relations.filter(r => (r.relationship || '').includes('Oğlu') || (r.relationship || '').includes('Kızı'));
  const otherRelations = relations.filter(r => 
    r.name !== mainPersonName && 
    r.relationship !== 'Eşi' && 
    !(r.relationship || '').includes('Oğlu') && 
    !(r.relationship || '').includes('Kızı')
  );

  return (
    <div>
      <div className="mb-8 flex items-center gap-4">
        <h2 className="text-xl font-bold text-foreground">Ilişkiler</h2>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Family Tree */}
      <div className="flex flex-col items-center">
        {/* Top Row - Other Relations */}
        <div className="mb-8 flex flex-wrap justify-center gap-8">
          {otherRelations.map((relation) => (
            <div key={relation.id} className="flex flex-col items-center">
              <div className="relative mb-3 h-24 w-24 overflow-hidden rounded-full border-4 border-primary/30">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%208%20Mar%202026%2004_12_33-Ngg0T0Wh2LPuyRvWJYt9sEaIrIKmdO.png)`,
                  }}
                />
              </div>
              <h4 className="text-center font-semibold text-foreground">{relation.name}</h4>
              <p className="text-center text-xs text-muted-foreground">{relation.relationship}</p>
              {relation.children && (
                <p className="mt-1 text-center text-xs text-primary">{relation.children.join(', ')}</p>
              )}
            </div>
          ))}
        </div>

        {/* Center Row - Main Person */}
        <div className="relative mb-8 flex items-center justify-center gap-16">
          {/* Main Person */}
          <div className="flex flex-col items-center">
            <div className="relative mb-3 h-32 w-32 overflow-hidden rounded-full border-4 border-primary">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%208%20Mar%202026%2004_12_33-Ngg0T0Wh2LPuyRvWJYt9sEaIrIKmdO.png)`,
                }}
              />
            </div>
            <h4 className="text-center text-lg font-bold text-foreground">{mainPersonName}</h4>
          </div>
        </div>

        {/* Children Row */}
        {children.length > 0 && (
          <>
            {/* Connecting Line */}
            <div className="mb-4 h-8 w-px bg-primary/30" />
            
            <div className="flex flex-wrap justify-center gap-8">
              {children.map((child) => (
                <div key={child.id} className="flex flex-col items-center">
                  <div className="relative mb-3 h-20 w-20 overflow-hidden rounded-full border-4 border-primary/30">
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%208%20Mar%202026%2004_12_33-Ngg0T0Wh2LPuyRvWJYt9sEaIrIKmdO.png)`,
                      }}
                    />
                  </div>
                  <h4 className="text-center font-semibold text-foreground">{child.name}</h4>
                  <p className="text-center text-xs text-muted-foreground">{child.relationship}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Spouse at Bottom */}
        {spouse && (
          <>
            <div className="my-4 h-8 w-px bg-primary/30" />
            <div className="flex flex-col items-center">
              <div className="relative mb-3 h-24 w-24 overflow-hidden rounded-full border-4 border-accent/50">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%208%20Mar%202026%2004_12_33-Ngg0T0Wh2LPuyRvWJYt9sEaIrIKmdO.png)`,
                  }}
                />
              </div>
              <h4 className="text-center font-semibold text-foreground">{spouse.name}</h4>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
