import os
import google.generativeai as genai

# Configure Google Gemini API
api_key = os.getenv("GEMINI_API_KEY", "")
if api_key:
    genai.configure(api_key=api_key)


def explain_replenishment(product_name, sku, current_stock, reorder_point, recommended_qty, cost, reason, supplier):
    """
    Phase 9: AI Explanation Layer.
    Uses Gemini LLM to construct human-readable, executive explanations for procurement recommendations.
    """
    if not api_key:
        # Standalone semantic fallback compiler
        return (
            f"Fulfillment analysis suggests trigger replenishment of {recommended_qty} units for {product_name} ({sku}) "
            f"sourced from {supplier}. Current stock level ({current_stock}) has dropped below the reorder point of {reorder_point}. "
            f"Based on a lead time of 4 days, ordering now prevents a projected regional stock-out. Estimated budget impact: ${cost:,.2f}."
        )

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")
        prompt = (
            f"You are SokoPulse AI, an intelligent supply chain optimization engine. "
            f"Explain to a warehouse operations manager why they should approve the following purchase order recommendation:\n"
            f"- Product: {product_name} (SKU: {sku})\n"
            f"- Current Stock: {current_stock} units\n"
            f"- Reorder Point: {reorder_point} units\n"
            f"- Suggested Replenishment Qty: {recommended_qty} units\n"
            f"- Estimated Spend: ${cost}\n"
            f"- Target Supplier: {supplier}\n"
            f"- Operational Trigger Reason: {reason}\n\n"
            f"Write a concise (2-3 sentences), professional explanation emphasizing lead time safety, cost efficiency, and stockout prevention."
        )
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"⚠️ Gemini API explanation generation failed: {e}")
        return (
            f"Recommended replenishment of {recommended_qty} units for {product_name} to restore safety stock buffer. "
            f"Operational trigger: {reason}. Sourced via {supplier}."
        )
