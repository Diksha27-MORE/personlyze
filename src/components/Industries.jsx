import DynamicFrameLayout from "./DynamicFrameLayout";
import "./Industries.css";


function Industries() {
  return (
    <section className="industries">
      <div className="industries-header">
        <h2>Personalization for Every Business!</h2>


  <p className="industries-hint">
    Click on your category to explore →
  </p>
</div>

      <DynamicFrameLayout />
    </section>
  );
}

export default Industries;