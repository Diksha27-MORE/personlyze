import DynamicFrameLayout from "./DynamicFrameLayout";
import "./Industries.css";

function Industries() {
  return (
    <section className="industries">
      <div className="industries-header">
        <h2>What's your industry?</h2>
        <p>
          We'll show you the exact problems Personlyze solves for your category.
        </p>
      </div>

      <DynamicFrameLayout />
    </section>
  );
}

export default Industries;