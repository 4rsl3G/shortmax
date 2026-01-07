import Link from "next/link"
import { TitleItem } from "@/lib/api"
import { motion } from "framer-motion"
import ShimmerImage from "./ShimmerImage"

export default function PosterCard({ item }: { item: TitleItem }) {
  return (
    <Link href={`/title/${item.code}`} className="block">
      <motion.div
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
      >
        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-2xl ui-panel ui-border">
          <ShimmerImage
            src={item.cover}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 45vw, 200px"
            className="object-cover"
          />

          {/* overlay minimal (tanpa gradient): pakai scrim halus */}
          <div className="absolute inset-0 bg-black/12" />

          <div className="absolute top-2 right-2 flex gap-2">
            <span className="rounded-full ui-panel ui-border px-2 py-1 text-[11px] inline-flex items-center gap-1">
              <i className="ri-heart-3-line" />
              {item.favorites.toLocaleString()}
            </span>
          </div>

          <div className="absolute bottom-2 left-2 right-2">
            <div className="text-sm font-semibold line-clamp-2">{item.name}</div>
            <div className="text-[11px] ui-muted mt-0.5 flex items-center gap-2">
              <span className="inline-flex items-center gap-1">
                <i className="ri-film-line" /> {item.episodes} eps
              </span>
              <span className="inline-flex items-center gap-1">
                <i className="ri-eye-line" /> {item.views.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}