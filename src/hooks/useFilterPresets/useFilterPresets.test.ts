// @ts-strict-ignore
import { renderHook } from "@testing-library/react-hooks";

import { useFilterPresets } from "./useFilterPresets";

const mockNavigate = jest.fn();
jest.mock("@dashboard/hooks/useNavigator", () => () => mockNavigate);

const baseUrl = "http://localhost";

afterEach(() => {
  jest.clearAllMocks();
});

describe("useFilterPresets", () => {
  it("should return saved filter presets from storage", () => {
    // Arrange && Act
    const presets = [
      { name: "preset1", data: "data1" },
      { name: "preset2", data: "data2" },
    ];

    const { result } = renderHook(() =>
      useFilterPresets({
        getUrl: jest.fn(),
        params: {},
        reset: jest.fn(),
        storageUtils: {
          deleteFilterTab: jest.fn(),
          getFilterTabs: jest.fn(() => presets),
          saveFilterTab: jest.fn(),
          updateFilterTab: jest.fn(),
        },
      }),
    );

    // Assert
    expect(result.current.presets).toEqual(presets);
  });

  it("should return selected preset index when activeTab param", () => {
    // Arrange & Act
    const { result } = renderHook(() =>
      useFilterPresets({
        getUrl: jest.fn(),
        params: {
          activeTab: "1",
        },
        reset: jest.fn(),
        storageUtils: {
          deleteFilterTab: jest.fn(),
          getFilterTabs: jest.fn(() => []),
          saveFilterTab: jest.fn(),
          updateFilterTab: jest.fn(),
        },
      }),
    );

    // Assert
    expect(result.current.selectedPreset).toEqual(1);
  });

  it("should handle active filter preset change", () => {
    // Arrange
    const savedPreset = { name: "preset1", data: "query=John" };
    const { result } = renderHook(() =>
      useFilterPresets({
        getUrl: jest.fn(() => baseUrl),
        params: {},
        reset: jest.fn(),
        storageUtils: {
          deleteFilterTab: jest.fn(),
          getFilterTabs: jest.fn(() => [savedPreset]),
          saveFilterTab: jest.fn(),
          updateFilterTab: jest.fn(),
        },
      }),
    );

    // Act
    result.current.onPresetChange(1);

    // Assert
    expect(mockNavigate).toHaveBeenCalledWith(
      `${baseUrl}?${savedPreset.data}&activeTab=1`,
    );
  });

  it("should handle prset delete and navigate to base url when active preset is equal deleting preset", () => {
    // Arrange
    const mockDeleteStorage = jest.fn();
    const mockReset = jest.fn();

    const { result } = renderHook(() =>
      useFilterPresets({
        getUrl: jest.fn(() => baseUrl),
        params: {
          action: "delete",
          activeTab: "1",
        },
        reset: mockReset,
        storageUtils: {
          deleteFilterTab: mockDeleteStorage,
          getFilterTabs: jest.fn(),
          saveFilterTab: jest.fn(),
          updateFilterTab: jest.fn(),
        },
      }),
    );

    // Act(
    result.current.setPresetIdToDelete(1);
    result.current.onPresetDelete();

    // Assert
    expect(mockDeleteStorage).toHaveBeenCalledWith(1);
    expect(mockReset).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(baseUrl);
  });

  it("should handle prset delete and navigate to active preset when preset to delete is different that preset to delete", () => {
    // Arrange
    const mockDeleteStorage = jest.fn();
    const mockReset = jest.fn();

    const { result } = renderHook(() =>
      useFilterPresets({
        getUrl: jest.fn(() => baseUrl),
        params: {
          action: "delete",
          activeTab: "2",
        },
        reset: mockReset,
        storageUtils: {
          deleteFilterTab: mockDeleteStorage,
          getFilterTabs: jest.fn(),
          saveFilterTab: jest.fn(),
          updateFilterTab: jest.fn(),
        },
      }),
    );

    // Act(
    result.current.setPresetIdToDelete(1);
    result.current.onPresetDelete();

    // Assert
    expect(mockDeleteStorage).toHaveBeenCalledWith(1);
    expect(mockReset).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(baseUrl + "?activeTab=1");
  });

  it("should handle save new filter preset", () => {
    // Arrange
    const mockSaveStorage = jest.fn();

    delete window.location;
    window.location = {
      search: "?query=John",
    } as Location;

    const { result } = renderHook(() =>
      useFilterPresets({
        getUrl: jest.fn(() => baseUrl),
        params: {},
        reset: jest.fn(),
        storageUtils: {
          deleteFilterTab: jest.fn(),
          getFilterTabs: jest.fn(() => []),
          saveFilterTab: mockSaveStorage,
          updateFilterTab: jest.fn(),
        },
      }),
    );

    // Act
    result.current.onPresetSave({ name: "new-preset" });

    // Assert
    expect(mockSaveStorage).toHaveBeenCalledWith("new-preset", "query=John");
    expect(mockNavigate).toHaveBeenCalledWith(`${baseUrl}?activeTab=1`);
  });

  it("should handle update existing filter preset", () => {
    // Arrange
    const mockUpdateStorage = jest.fn();

    delete window.location;
    window.location = {
      search: "?query=JoeDoe",
    } as Location;

    const { result } = renderHook(() =>
      useFilterPresets({
        getUrl: jest.fn(() => baseUrl),
        params: {},
        reset: jest.fn(),
        storageUtils: {
          deleteFilterTab: jest.fn(),
          getFilterTabs: jest.fn(() => [
            {
              name: "current-preset",
              data: "query=John",
            },
          ]),
          saveFilterTab: jest.fn(),
          updateFilterTab: mockUpdateStorage,
        },
      }),
    );

    // Act
    result.current.onPresetUpdate("current-preset");

    // Assert
    expect(mockUpdateStorage).toHaveBeenCalledWith(
      "current-preset",
      "query=JoeDoe",
    );
    expect(mockNavigate).toHaveBeenCalledWith(
      `${baseUrl}?query=John&activeTab=1`,
    );
  });
});
