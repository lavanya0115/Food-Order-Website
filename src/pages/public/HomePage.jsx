import { ArrowRight, Truck } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ImportantNotes from "../../components/common/ImportantNotes";
export default function HomePage() {
  return (
    <>
      <section className="temple-hero">
        <div className="container-ui grid items-center gap-8 py-10 lg:min-h-[520px] lg:grid-cols-[1.05fr_.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="badge bg-rose-100 text-brand">
              Fresh · Frozen · Ready to Eat
            </span>
            <h1 className="mt-4 text-4xl font-black leading-tight tracking-tight text-ink sm:text-6xl">
              Traditional favourites,{" "}
              <span className="text-brand">delivered fresh.</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg text-stone-600">
              Authentic food manufactured and distributed by RKJ Thondamans Food
              Pte Ltd.
            </p>
            <div className="mt-6 flex gap-3">
              <Link to="/menu" className="btn-primary">
                View menu <ArrowRight size={18} />
              </Link>
              <Link to="/delivery" className="btn-secondary">
                <Truck size={18} />
                Delivery information
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      <div className="container-ui py-8">
        <ImportantNotes />
      </div>
    </>
  );
}
