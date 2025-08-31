// import { Metadata } from "next";

// type Props={params: Promise<{productId:string}>};

// export const generateMetadata = async({params}: Props):Promise<Metadata> =>{
//     const id = (await params).productId;
//      //api den çekmelisin aslında biz şöyle simüle edicez

//      ///!!!!!!buna bak
//      const title = await new Promise((resolve)=> {setTimeout(()=>{resolve(`Book ${id}`);},100)});
//     return{
//         title: `Product ${title}`,
//     };
// }

// export default async function ProductDetails({params}: Props){
//     const productId = (await params).productId;
//     return (<>
//         <h1>Product {productId} Details</h1>
    
//     </>);
// }
/*
The : { params: Promise<{productId: string}> } part is type annotation:

{ ... } outer braces → object type

params: Promise<...> → says params is a Promise

<{ productId: string }> → says that Promise resolves to an object { productId: string }.


*/

export default function Book(){
      return (
    <div>
      <p>This is a book page</p>
    </div>
  );
}