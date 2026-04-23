"use client";

import React from "react";
import { Box, Divider, Paper, Switch, Typography } from "@mui/material";
import ProductList from "./ProductList";
import PageHeader from "./PageHeader";
import ProductDetailHeader from "./ProductDetailHeader";
import GeneralInformationSection from "./GeneralInformationSection";
import RecipeIngredientsTable from "./RecipeIngredientsTable";
import AddOnsManagementSection from "./AddOnsManagementSection";
import { addOnGroups, ingredients, statCards } from "./data";
import { StatCard } from "./parts";
import { createIngredientColumns } from "./ingredientColumns";
import { contentGridSx, pageContainerSx, statGridSx } from "./styles";

export default function FnbMenuVariationsPage() {
  const [selectedProduct, setSelectedProduct] = React.useState(1);
  const [showRecipeBom, setShowRecipeBom] = React.useState(true);
  const ingredientColumns = React.useMemo(() => createIngredientColumns(), []);

  return (
    <Box sx={pageContainerSx}>
      <PageHeader />

      <Box sx={statGridSx}>
        {statCards.map((card) => (
          <StatCard key={card.title} card={card} />
        ))}
      </Box>

      <Box sx={contentGridSx}>
        <ProductList
          selectedProduct={selectedProduct}
          onSelect={setSelectedProduct}
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
          <ProductDetailHeader />

          <Divider />

          <GeneralInformationSection />

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
