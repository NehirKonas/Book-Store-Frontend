// "use client";
// import styles from  './order-book.module.css';
// import {useRouter} from "next/navigation";

// export default function OrderBook(){
//     const router = useRouter();
//     const handleClick = ()=>{
//         console.log("Placed your order!");
//         router.push("/");
//     };
//     return (<>
//     <h1>Order Book</h1>
//     <button className={styles.orderBtn} onClick={handleClick}>Place Order</button>
//     </>);
// }
export default function Cart(){
      return (
    <div>
      <p>This is a cart page</p>
    </div>
  );
}