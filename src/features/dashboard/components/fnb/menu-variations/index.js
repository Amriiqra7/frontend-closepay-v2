"use client";

import React from "react";
import useSWR from "swr";
import useSWRInfinite from "swr/infinite";
import { useRouter } from "next/navigation";
import { Box, Divider, Paper, Switch, Typography } from "@mui/material";
import ProductList from "./ProductList";
import PageHeader from "./PageHeader";
import ProductDetailHeader from "./ProductDetailHeader";
import GeneralInformationSection from "./GeneralInformationSection";
import RecipeIngredientsTable from "./RecipeIngredientsTable";
import AddOnsManagementSection from "./AddOnsManagementSection";
import { addOnGroups, ingredients } from "./data";
import { createIngredientColumns } from "./ingredientColumns";
import { contentGridSx, pageContainerSx } from "./styles";
import { fnbMenu, fnbMenuCategory, fnbMenuVariant } from "@/core/services/api_fnb";
import { showErrorToast } from "@/shared/utils/toast";
import { formatCurrencyIDR } from "@/shared/utils/format";

const mapListItem = (item, categoriesMap = {}) => ({
  id: item?._id || "",
  name: item?.name || "-",
  category: categoriesMap[item?.categoryId] || "-",
  price: item?.useVariant
    ? `Mulai ${formatCurrencyIDR(item?.minVariantPrice)}`
    : formatCurrencyIDR(item?.basePrice),
  status: item?.isAvailable ? "Active" : "Inactive",
  tone: item?.isAvailable ? "#74c0e3" : "#f39a96",
});

const apiFetcher = (request) => request;
const PAGE_SIZE = 10;

export default function FnbMenuVariationsPage() {
  const router = useRouter();
  const ingredientColumns = React.useMemo(() => createIngredientColumns(), []);
  const [showRecipeBom, setShowRecipeBom] = React.useState(true);
  const [selectedProduct, setSelectedProduct] = React.useState("");

  const {
    data: categoryResponse,
    error: categoryError,
  } = useSWR("fnb-menu-categories", () => apiFetcher(fnbMenuCategory.combo({ size: 10 })));

  const categoryOptions = React.useMemo(
    () =>
      (categoryResponse?.data || []).map((item) => ({
        value: item._id,
        label: item.name,
      })),
    [categoryResponse]
  );

  const categoryMap = React.useMemo(
    () =>
      categoryOptions.reduce((acc, item) => {
        acc[item.value] = item.label;
        return acc;
      }, {}),
    [categoryOptions]
  );

  const {
    data: listPages,
    error: listError,
    isLoading: listLoading,
    size: listPageSize,
    setSize,
    isValidating: listValidating,
  } = useSWRInfinite(
    (pageIndex, previousPageData) => {
      if (previousPageData && !previousPageData?.data?.items?.length) {
        return null;
      }
      return ["fnb-menu-list", pageIndex + 1, PAGE_SIZE];
    },
    ([, page]) => apiFetcher(fnbMenu.find({ size: PAGE_SIZE, page, order: "asc" })),
    { revalidateFirstPage: false, revalidateOnFocus: false }
  );

  const products = React.useMemo(
    () =>
      (listPages || [])
        .flatMap((pageResponse) => pageResponse?.data?.items || [])
        .map((item) => mapListItem(item, categoryMap)),
    [listPages, categoryMap]
  );

  const lastPage = listPages?.[listPages.length - 1];
  const hasMoreProducts = React.useMemo(() => {
    const lastItemsLength = (lastPage?.data?.items || []).length;
    // Continue while server still returns a full page.
    // Stop only when page result is shorter than requested size.
    return lastItemsLength === PAGE_SIZE;
  }, [lastPage]);

  React.useEffect(() => {
    if (!selectedProduct && products.length > 0) {
      setSelectedProduct(products[0].id);
    }
  }, [products, selectedProduct]);

  const handleReachListEnd = React.useCallback(() => {
    if (!hasMoreProducts || listValidating) return;
    setSize((currentSize) => currentSize + 1);
  }, [hasMoreProducts, listValidating, setSize]);

  const { data: detailResponse, error: detailError } = useSWR(
    selectedProduct ? ["fnb-menu-detail", selectedProduct] : null,
    () => apiFetcher(fnbMenu.getById(selectedProduct))
  );

  const menuDetail = detailResponse?.data || {};

  const {
    data: variantResponse,
    error: variantError,
    isLoading: variantLoading,
  } = useSWR(
    selectedProduct && menuDetail?.useVariant ? ["fnb-menu-variants", selectedProduct] : null,
    () =>
      apiFetcher(
        fnbMenuVariant.find({
          menuId: selectedProduct,
          size: 10,
          page: 1,
          order: "asc",
        })
      )
  );

  const variants = variantResponse?.data?.items || [];

  React.useEffect(() => {
    if (categoryError) {
      showErrorToast(categoryError?.response?.data?.message || "Gagal memuat kategori menu.");
    }
  }, [categoryError]);

  React.useEffect(() => {
    if (listError) {
      showErrorToast(listError?.response?.data?.message || "Gagal memuat product list.");
    }
  }, [listError]);

  React.useEffect(() => {
    if (detailError) {
      showErrorToast(detailError?.response?.data?.message || "Gagal memuat detail menu.");
    }
  }, [detailError]);

  React.useEffect(() => {
    if (variantError) {
      showErrorToast(variantError?.response?.data?.message || "Gagal memuat variant menu.");
    }
  }, [variantError]);

  const detailTitle = menuDetail?.name || "Detail Menu";

  return (
        <Box sx={pageContainerSx}>
          <PageHeader onAddMenu={() => router.push("/fnb/master-product/menu-variations/new")} />

          <Box sx={contentGridSx}>
            <ProductList
              selectedProduct={selectedProduct}
              onSelect={setSelectedProduct}
              products={products}
              loading={listLoading}
              loadingMore={listValidating && !listLoading}
              hasMore={hasMoreProducts}
              pageSize={listPageSize}
              onReachEnd={handleReachListEnd}
            />

            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                border: "1px solid #e8edf3",
                overflow: "hidden",
                boxShadow: "0 20px 45px rgba(15, 23, 42, 0.05)",
              }}
            >
              <ProductDetailHeader
                title={detailTitle}
                productId={menuDetail?._id || "-"}
                onPrimaryAction={() =>
                  menuDetail?._id && router.push(`/fnb/master-product/menu-variations/${menuDetail._id}/edit`)
                }
                primaryLabel="Edit"
              />
              <Divider />

              <GeneralInformationSection
                menuName={menuDetail?.name || ""}
                category={menuDetail?.categoryId || ""}
                basePrice={menuDetail?.basePrice ?? 0}
                minVariantPrice={menuDetail?.minVariantPrice ?? 0}
                statusLabel={menuDetail?.isAvailable ? "Active" : "Inactive"}
                description={menuDetail?.description || ""}
                categoryOptions={categoryOptions}
                statusChecked={Boolean(menuDetail?.isAvailable)}
                useVariant={Boolean(menuDetail?.useVariant)}
                imagePreview={menuDetail?.imageUrl || ""}
                readOnly
              />

              {menuDetail?.useVariant ? (
                <Box sx={{ px: { xs: 2.25, md: 2.5 }, pb: 2.25 }}>
                  <Typography sx={{ color: "#0f172a", fontWeight: 800, mb: 1.25 }}>Variants</Typography>
                  {variantLoading ? (
                    <Typography sx={{ color: "#6b7280", fontSize: "0.86rem" }}>
                      Memuat variant...
                    </Typography>
                  ) : variants.length ? (
                    variants.map((variant) => (
                      <Paper
                        key={variant._id}
                        elevation={0}
                        sx={{ p: 1.25, border: "1px solid #e8edf3", borderRadius: 1.75, mb: 1 }}
                      >
                        <Typography sx={{ fontWeight: 700, color: "#111827", fontSize: "0.9rem" }}>
                          {variant.name}
                        </Typography>
                        <Typography sx={{ color: "#6b7280", fontSize: "0.8rem" }}>
                          SKU: {variant.sku || "-"} | Price: {formatCurrencyIDR(variant.price)} |{" "}
                          {variant.isDefault ? "Default" : "Optional"}
                        </Typography>
                      </Paper>
                    ))
                  ) : (
                    <Typography sx={{ color: "#6b7280", fontSize: "0.86rem" }}>
                      Belum ada variant untuk product ini.
                    </Typography>
                  )}
                </Box>
              ) : null}

              <Divider />

              <Box
                sx={{
                  px: { xs: 2.25, md: 2.5 },
                  py: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  flexWrap: "wrap",
                  bgcolor: "#f8fafc",
                }}
              >
                <Typography sx={{ color: "#111827", fontSize: "0.9rem", fontWeight: 700 }}>
                  Show Recipe & Bill Of Materials (BOM)
                </Typography>
                <Switch
                  checked={showRecipeBom}
                  onChange={(event) => setShowRecipeBom(event.target.checked)}
                  size="small"
                />
              </Box>

              {showRecipeBom ? (
                <>
                  <Box sx={{ p: { xs: 2.25, md: 2.5 } }}>
                    <RecipeIngredientsTable
                      columns={ingredientColumns}
                      data={ingredients}
                      getRowId={(row) => row.id}
                      initialPageSize={5}
                      pageSizeOptions={[5, 10, 25]}
                    />
                  </Box>
                  <Divider />
                </>
              ) : (
                <Divider />
              )}

              <AddOnsManagementSection groups={addOnGroups} />
            </Paper>
          </Box>
        </Box>
  );
}
