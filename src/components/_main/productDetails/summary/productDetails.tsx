
import {
    Box,
    Grid,
    Typography,
} from "@mui/material";
import useTranslation from "next-translate/useTranslation";
import DetailRow from "./detailRow";



export default function ProdcutDetails({ ...props }) {

    const { product } = props;

    const { t } = useTranslation("common");

    return (
        <Box>
            {
                product?.operatingSystem && (
                    <DetailRow translation={t("operating-system")} value={product.operatingSystem} />
                )
            }

            {
                product?.osArchitecture && (
                    <DetailRow translation={t("os-architecture")} value={product.osArchitecture} />
                )
            }

            {
                product?.ramType && (
                    <DetailRow translation={t("ram-type")} value={product.ramType} />
                )
            }

            {
                product?.ramFrequency && (
                    <DetailRow translation={t("ram-frequency")} value={product.ramFrequency} />
                )
            }

            {
                product?.ramCapacity && (
                    <DetailRow translation={t("ram-capacity")} value={product.ramCapacity} />
                )
            }

            {
                product?.storageType && (
                    <DetailRow translation={t("storage-type")} value={product.storageType} />
                )
            }

            {
                product?.storageCapacity && (
                    <DetailRow translation={t("storage-capacity")} value={product.storageCapacity} />
                )
            }

            {
                product?.processor && (
                    <DetailRow translation={t("processor")} value={product.processor} />
                )
            }

            {
                product?.processorBrand && (
                    <DetailRow translation={t("processor-brand")} value={product.processorBrand} />
                )
            }

            {
                product?.processorGeneration && (
                    <DetailRow translation={t("processor-generation")} value={product.processorGeneration} />
                )
            }

            {
                product?.clockSpeed && (
                    <DetailRow translation={t("clock-speed")} value={product.clockSpeed} />
                )
            }

            {
                product?.cacheMemory && (
                    <DetailRow translation={t("cache-memory")} value={product.cacheMemory} />
                )
            }

            {
                product?.graphicsProcessor && (
                    <DetailRow translation={t("graphics-processor")} value={product.graphicsProcessor} />
                )
            }

            {
                product?.numberOfCores && (
                    <DetailRow translation={t("number-of-cores")} value={product.numberOfCores} />
                )
            }

            {
                product?.usbPorts && (
                    <DetailRow translation={t("usb-ports")} value={product.usbPorts} />
                )
            }

            {
                product?.hdmiPorts && (
                    <DetailRow translation={t("hdmi-ports")} value={product.hdmiPorts} />
                )
            }

            {
                product?.typeCPort && (
                    <DetailRow translation={t("clock-speed")} value={product.typeCPort} />
                )
            }

            {
                product?.micIn && (
                    <DetailRow translation={t("mic-in")} value={product.micIn} />
                )
            }

            {
                product?.ethernetPort && (
                    <DetailRow translation={t("ethernet-port")} value={product.ethernetPort} />
                )
            }


            {
                product?.touchScreen && (
                    <DetailRow translation={t("touch-screen")} value={product.touchScreen} />
                )
            }

            {
                product?.screenSize && (
                    <DetailRow translation={t("screen-size")} value={product.screenSize} />
                )
            }

            {
                product?.screenResolution && (
                    <DetailRow translation={t("screen-resolution")} value={product.screenResolution} />
                )
            }

            {
                product?.screenType && (
                    <DetailRow translation={t("screen-type")} value={product.screenType} />
                )
            }

            {
                product?.speakers && (
                    <DetailRow translation={t("speakers")} value={product.speakers} />
                )
            }

            {
                product?.internalMic && (
                    <DetailRow translation={t("internal-mic")} value={product.internalMic} />
                )
            }

            {
                product?.soundProperties && (
                    <DetailRow translation={t("sound-properties")} value={product.soundProperties} />
                )
            }

            {
                product?.wirelessLan && (
                    <DetailRow translation={t("wireless-lan")} value={product.wirelessLan} />
                )
            }

            {
                product?.bluetooth && (
                    <DetailRow translation={t("bluetooth")} value={product.bluetooth} />
                )
            }

            {
                product?.weight && (
                    <DetailRow translation={t("weight")} value={product.weight} />
                )
            }

            {
                product?.dimensions && (
                    <DetailRow translation={t("dimensions")} value={product.dimensions} />
                )
            }

            {
                product?.salesPackage && (
                    <DetailRow translation={t("sales-package")} value={product.salesPackage} />
                )
            }

        </Box>
    );
}