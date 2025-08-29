export default async function Docs({params}: {params:Promise<{slug:string[]}>})
{
    const {slug}=await params;
    if(slug?.length ===2){
        return <h1>Viewing docs for feature {slug[0]} and consept of {slug[1]}</h1>;
    }
    else if (slug?.length == 1){
        return <h1>Viewing docs for feature {slug[0]}</h1>;

    }
    return <h1>Docs Home Page</h1>;
} 




//catch all, sonrasına url de ne yazarsan yaz en başında docs gösteriri, basic 
//layoutu korur