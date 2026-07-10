import { upsertLink } from "@/lib/actions";
import type { Link } from "@/lib/types";

export default function LinkForm({ link }: { link?: Link }) {
  return (
    <form action={upsertLink} className="form">
      {link?.id && <input type="hidden" name="id" value={link.id} />}
      <label>
        Label
        <input name="label" defaultValue={link?.label ?? ""} />
      </label>
      <label>
        URL
        <input name="url" defaultValue={link?.url ?? ""} required />
      </label>
      <label>
        Tracking ID
        <input name="tracking_id" defaultValue={link?.tracking_id ?? ""} />
      </label>
      <label className="checkbox">
        <input
          type="checkbox"
          name="is_active"
          defaultChecked={link?.is_active ?? true}
        />
        Active
      </label>
      <button className="btn" type="submit">
        Save
      </button>
    </form>
  );
}
