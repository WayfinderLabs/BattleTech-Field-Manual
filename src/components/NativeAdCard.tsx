import { NativeAdAssets } from '@/hooks/useNativeAd';

interface NativeAdCardProps {
  assets: NativeAdAssets;
}

export const NativeAdCard = ({ assets }: NativeAdCardProps) => {
  return (
    <div className="bg-card border border-border rounded-sm p-3">
      {/* Top row: icon + advertiser + AD badge */}
      <div className="flex items-center gap-2 mb-2">
        {assets.icon && (
          <img
            src={assets.icon}
            alt=""
            className="w-6 h-6 rounded-sm object-cover flex-shrink-0"
          />
        )}
        {assets.advertiser && (
          <span className="text-muted-foreground font-mono text-badge flex-1 truncate">
            {assets.advertiser}
          </span>
        )}
        <span className="px-1.5 py-0.5 text-badge font-mono uppercase rounded-sm bg-primary text-primary-foreground flex-shrink-0">
          AD
        </span>
      </div>

      {/* Headline */}
      <h3 className="text-primary font-mono text-card-title uppercase tracking-wider mb-1">
        {assets.headline}
      </h3>

      {/* Body */}
      {assets.body && (
        <p className="text-muted-foreground font-mono text-badge line-clamp-2">
          {assets.body}
        </p>
      )}

      {/* CTA */}
      <button
        className="w-full bg-primary text-primary-foreground font-mono uppercase tracking-wider rounded-sm py-2 mt-2 text-body"
        type="button"
      >
        {assets.callToAction}
      </button>
    </div>
  );
};
