import React from "react";

// material
import { Box } from "@mui/material";

// components
import MenuDesktopList from "src/components/lists/menuDesktopList";
import MenuPopover from "src/components/popover/popover";

export default function MenuDesktop({ ...props }) {
  const { isOpen, scrollPosition, onClose, isLoading, data } = props;

  return (
    <MenuPopover
      open={isOpen}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={{
        top: scrollPosition > 29 ? 80 : 110 - scrollPosition,
        left: 0,
      }}
      isDesktop
    >
      {(isLoading ? Array.from(new Array(3)) : data)?.map((list: any) => {
        return (
          <Box key={Math.random()}>
            <MenuDesktopList
              list={list}
              isLoading={isLoading}
              onClose={onClose}
            />
          </Box>
        );
      })}
    </MenuPopover>
  );
}
