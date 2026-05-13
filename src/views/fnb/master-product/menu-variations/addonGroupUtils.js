const safeArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

const dedupeItems = (items = []) => {
  const seen = new Set();
  return items.filter((item) => {
    const key = item?._id || `${item?.name || ""}::${item?.price ?? ""}`;
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const buildAddonGroupSectionsFromSelections = (selectedGroups = [], itemsByGroup = []) => {
  const itemMap = new Map(itemsByGroup.map((item) => [item.groupId, item]));

  return safeArray(selectedGroups)
    .map((group) => {
      const groupId = group?._id || "";
      if (!groupId) return null;

      const matched = itemMap.get(groupId);
      return {
        _id: groupId,
        name: group?.name || matched?.groupName || "",
        items: dedupeItems(matched?.items || []),
      };
    })
    .filter(Boolean);
};

export const buildAddonGroupSectionsFromMapResponse = (response) => {
  const raw = response?.data?.items || response?.data || response?.items || [];
  const list = safeArray(raw);
  const sectionsMap = new Map();

  list.forEach((item) => {
    const detailGroups = safeArray(item?.detailAddonGroup);
    const resolvedGroups = detailGroups.length ? detailGroups : [item];

    resolvedGroups.forEach((groupItem) => {
      const group = groupItem?.addonGroup || item?.addonGroup || item?.group || null;
      const groupId =
        item?.addonGroupId ||
        group?._id ||
        (typeof item === "string" ? item : "") ||
        "";
      if (!groupId) return;

      const groupName = group?.name || item?.addonGroupName || groupItem?.addonGroupName || "";
      const items = dedupeItems(
        safeArray(groupItem?.addonItems)
          .concat(safeArray(item?.addonItems))
          .concat(safeArray(item?.items))
      );

      if (!sectionsMap.has(groupId)) {
        sectionsMap.set(groupId, {
          _id: groupId,
          name: groupName,
          items: [],
        });
      }

      const section = sectionsMap.get(groupId);
      if (!section.name && groupName) section.name = groupName;
      section.items = dedupeItems(section.items.concat(items));
    });
  });

  return Array.from(sectionsMap.values());
};
