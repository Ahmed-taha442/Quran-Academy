type Props = {
  videoId: string;
  title: string;
};

export function YoutubeEmbed({ videoId, title }: Props) {
  return (
    <div className="aspect-video overflow-hidden rounded-2xl border border-stone-300 bg-black shadow-sm">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
