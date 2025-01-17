const { Select } = require("enquirer");
const { copy } = require("../src/commands/copy");
const { clearCopyFolder } = require("../src/core/folder");
const generatePath = require("../src/helpers/pathHelper");
const { log } = require("../src/utils/logger");
const { showMenu } = require("../src/cli/menu");

jest.mock("enquirer", () => ({
  Select: jest.fn(),
}));
jest.mock("../src/commands/copy");
jest.mock("../src/core/folder");
jest.mock("../src/helpers/pathHelper");
jest.mock("../src/utils/logger");

describe("showMenu function", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("should call generatePath with process.argv", async () => {
    // Simulate user selecting first option
    Select.mockImplementation(() => ({
      run: jest
        .fn()
        .mockResolvedValue("Copy current changes to directory for upload"),
    }));

    await showMenu();

    expect(generatePath).toHaveBeenCalledWith(process.argv);
  });

  it("should log info for copying current changes", async () => {
    const mockPath = "/mock/path";
    generatePath.mockReturnValue(mockPath);

    // Simulate user selecting first option
    Select.mockImplementation(() => ({
      run: jest
        .fn()
        .mockResolvedValue("Copy current changes to directory for upload"),
    }));

    await showMenu();

    expect(log.info).toHaveBeenCalledWith("Copying current changes...");
    expect(copy).toHaveBeenCalledWith("commit", mockPath);
  });

  it("should log info for copying changes from main branch", async () => {
    const mockPath = "/mock/path";
    generatePath.mockReturnValue(mockPath);

    // Simulate user selecting second option
    Select.mockImplementation(() => ({
      run: jest
        .fn()
        .mockResolvedValue(
          "Copy changes from main branch to directory for upload"
        ),
    }));

    await showMenu();

    expect(log.info).toHaveBeenCalledWith(
      "Copying changes from main branch..."
    );
    expect(copy).toHaveBeenCalledWith("branch", mockPath);
  });

  it("should clear copy folder and log success", async () => {
    // Simulate user selecting third option
    Select.mockImplementation(() => ({
      run: jest.fn().mockResolvedValue("Delete all files in upload-directory"),
    }));

    await showMenu();

    expect(log.info).toHaveBeenCalledWith("Deleting files and folder...");
    expect(clearCopyFolder).toHaveBeenCalled();
    expect(log.success).toHaveBeenCalledWith("Folder cleared successfully.");
  });

  it("should create Select prompt with correct name", async () => {
    // Simulate user selecting first option
    Select.mockImplementation(() => ({
      run: jest
        .fn()
        .mockResolvedValue("Copy current changes to directory for upload"),
    }));

    await showMenu();

    expect(Select).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "menu",
      })
    );
  });

  it("should have exactly 3 menu choices", async () => {
    // Simulate user selecting first option
    Select.mockImplementation(() => ({
      run: jest
        .fn()
        .mockResolvedValue("Copy current changes to directory for upload"),
    }));

    await showMenu();

    const menuChoices = Select.mock.calls[0][0].choices;
    expect(menuChoices).toHaveLength(3);
    expect(menuChoices).toEqual([
      "Copy current changes to directory for upload",
      "Copy changes from main branch to directory for upload",
      "Delete all files in upload-directory",
    ]);
  });

  it("should have correct prompt message", async () => {
    // Simulate user selecting first option
    Select.mockImplementation(() => ({
      run: jest
        .fn()
        .mockResolvedValue("Copy current changes to directory for upload"),
    }));

    await showMenu();

    expect(Select).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "What can I do for you?",
      })
    );
  });

  it("should pass the generated path to copy for current changes", async () => {
    const mockPath = "/specific/test/path";
    generatePath.mockReturnValue(mockPath);

    // Simulate user selecting first option
    Select.mockImplementation(() => ({
      run: jest
        .fn()
        .mockResolvedValue("Copy current changes to directory for upload"),
    }));

    await showMenu();

    expect(copy).toHaveBeenCalledWith("commit", mockPath);
  });

  it("should pass the generated path to copy for main branch changes", async () => {
    const mockPath = "/another/test/path";
    generatePath.mockReturnValue(mockPath);

    // Simulate user selecting second option
    Select.mockImplementation(() => ({
      run: jest
        .fn()
        .mockResolvedValue(
          "Copy changes from main branch to directory for upload"
        ),
    }));

    await showMenu();

    expect(copy).toHaveBeenCalledWith("branch", mockPath);
  });

  it("should not call copy or clearCopyFolder for unrecognized selection", async () => {
    // Simulate an unrecognized selection
    Select.mockImplementation(() => ({
      run: jest.fn().mockResolvedValue("Unknown option"),
    }));

    await showMenu();

    expect(copy).not.toHaveBeenCalled();
    expect(clearCopyFolder).not.toHaveBeenCalled();
  });

  it("should call generatePath only once per menu interaction", async () => {
    // Simulate user selecting first option
    Select.mockImplementation(() => ({
      run: jest
        .fn()
        .mockResolvedValue("Copy current changes to directory for upload"),
    }));

    await showMenu();

    expect(generatePath).toHaveBeenCalledTimes(1);
  });

  it("should use process.argv when generating path", async () => {
    // Simulate user selecting first option
    Select.mockImplementation(() => ({
      run: jest
        .fn()
        .mockResolvedValue("Copy current changes to directory for upload"),
    }));

    await showMenu();

    expect(generatePath).toHaveBeenCalledWith(process.argv);
  });
});
